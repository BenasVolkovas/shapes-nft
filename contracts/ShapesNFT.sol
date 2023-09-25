// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract ShapesNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string public contentId = "";
    event NewNFTMinted(address sender, uint256 tokenId);

    constructor(string memory _contentId) ERC721("ShapesNFT", "SHP") {
        contentId = _contentId;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function payToMint() public payable returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        require(msg.value >= 0.05 ether, "Need to pay up!");
        require(newTokenId < 50, "All 50 NFTs have already been minted"); // max 50 random NFTs
        _tokenIdCounter.increment();

        string memory metadataURI = string(
            abi.encodePacked(
                contentId,
                "/",
                Strings.toString(newTokenId + 1),
                ".json"
            )
        );
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        emit NewNFTMinted(msg.sender, newTokenId);

        return newTokenId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function updateContentId(string memory _newContentId) public onlyOwner {
        contentId = _newContentId;
    }
}
